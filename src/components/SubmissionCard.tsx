import React from 'react';
import { ArrowUp, MessageSquare, ExternalLink, Image, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Submission } from '../types';

interface SubmissionCardProps {
  submission: Submission;
  onVote: () => void;
  onClick: () => void;
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

export default function SubmissionCard({ submission, onVote, onClick }: SubmissionCardProps) {
  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700 hover:border-gray-600"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <button
            onClick={handleVoteClick}
            className="p-2 rounded-lg bg-gray-700 hover:bg-red-600 transition-colors group"
          >
            <ArrowUp className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
          <span className="text-sm font-semibold text-gray-300">{submission.votes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {submission.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{submission.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(submission.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {submission.imageUrl && (
                <div className="p-1 bg-gray-700 rounded">
                  <Image className="w-4 h-4 text-gray-400" />
                </div>
              )}
              {submission.demoUrl && (
                <div className="p-1 bg-gray-700 rounded">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 mb-4 line-clamp-3">{submission.description}</p>

          {/* Code Preview */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-hidden">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    
                    if (!inline && language) {
                      return (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="text-sm"
                          customStyle={{
                            margin: 0,
                            background: 'transparent',
                            fontSize: '0.875rem',
                            maxHeight: '200px',
                            overflow: 'hidden'
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    }
                    
                    return (
                      <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {submission.codeSnippet.length > 300 
                  ? submission.codeSnippet.substring(0, 300) + '...'
                  : submission.codeSnippet
                }
              </ReactMarkdown>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColors[submission.category]}`}>
                {submission.category}
              </span>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{submission.comments}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {submission.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  {tag}
                </span>
              ))}
              {submission.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                  +{submission.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}