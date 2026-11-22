import React, { useState } from 'react';
import { ArrowLeft, ArrowUp, MessageSquare, ExternalLink, Image, Calendar, User, Share2 } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import type { Submission } from '../types';

interface SubmissionDetailProps {
  submission: Submission;
  onBack: () => void;
  onVote: () => void;
}

const categoryColors = {
  frontend: 'bg-blue-500',
  backend: 'bg-green-500',
  devops: 'bg-orange-500',
  database: 'bg-purple-500',
  security: 'bg-red-500',
  performance: 'bg-yellow-500',
  architecture: 'bg-indigo-500',
};

export default function SubmissionDetail({ submission, onBack, onVote }: SubmissionDetailProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: submission.title,
        text: submission.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to submissions</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          {/* Title and Meta */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-4">{submission.title}</h1>
            
            <div className="flex items-center space-x-6 text-gray-400 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{submission.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(submission.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{submission.comments} comments</span>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">{submission.description}</p>
          </div>

          {/* Vote and Category */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={onVote}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors group"
              >
                <ArrowUp className="w-5 h-5 text-gray-400 group-hover:text-white" />
                <span className="font-semibold text-gray-300 group-hover:text-white">
                  {submission.votes}
                </span>
              </button>

              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${categoryColors[submission.category]}`}>
                {submission.category}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {submission.imageUrl && (
                <a
                  href={submission.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4" />
                  <span className="text-sm">Screenshot</span>
                </a>
              )}
              
              {submission.demoUrl && (
                <a
                  href={submission.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Try Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Code Content */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <MarkdownPreview content={submission.codeSnippet} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {submission.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Discussion ({submission.comments})
            </h2>
            
            {/* Comment Form */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <textarea
                placeholder="Share your thoughts on this shameful code..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-3">
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Add Comment
                </button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">CodeReviewer42</span>
                    <span className="text-gray-400 text-sm">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-400">12</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  This is a perfect example of what happens when you don't follow SOLID principles. 
                  The lack of error handling alone makes this production-breaking code.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">RefactorMaster</span>
                    <span className="text-gray-400 text-sm">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-400">8</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  I've seen this pattern in legacy codebases. The global state management here 
                  is a nightmare for testing and debugging. Great educational example!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}