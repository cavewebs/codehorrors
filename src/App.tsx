import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import FilterSidebar from './components/FilterSidebar';
import SubmissionCard from './components/SubmissionCard';
import SubmissionForm from './components/SubmissionForm';
import SubmissionDetail from './components/SubmissionDetail';
import { mockSubmissions } from './utils/mockData';
import type { Submission, Category } from './types';

function App() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions.filter(submission => {
      const matchesCategory = selectedCategory === 'all' || submission.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => submission.tags.includes(tag));
      const matchesSearch = searchQuery === '' || 
        submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesTags && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'votes') {
        return b.votes - a.votes;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [submissions, selectedCategory, selectedTags, searchQuery, sortBy]);

  const handleVote = (id: string) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === id 
        ? { ...submission, votes: submission.votes + 1 }
        : submission
    ));
  };

  const handleSubmit = (newSubmission: Omit<Submission, 'id' | 'votes' | 'comments' | 'createdAt'>) => {
    const submission: Submission = {
      ...newSubmission,
      id: Date.now().toString(),
      votes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    setSubmissions(prev => [submission, ...prev]);
    setShowSubmissionForm(false);
  };

  if (showSubmissionForm) {
    return (
      <SubmissionForm 
        onSubmit={handleSubmit}
        onCancel={() => setShowSubmissionForm(false)}
      />
    );
  }

  if (selectedSubmission) {
    return (
      <SubmissionDetail 
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
        onVote={() => handleVote(selectedSubmission.id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-400">CodeShame</h1>
              <p className="text-gray-400 hidden sm:block">Learn from the worst code practices</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                />
              </div>
              
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onCategoryChange={setSelectedCategory}
              onTagsChange={setSelectedTags}
              submissions={submissions}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSortBy('votes')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    sortBy === 'votes' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Most Shameful</span>
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    sortBy === 'recent' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent</span>
                </button>
              </div>
              
              <div className="text-gray-400">
                {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Submissions Grid */}
            <div className="grid gap-6">
              {filteredSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onVote={() => handleVote(submission.id)}
                  onClick={() => setSelectedSubmission(submission)}
                />
              ))}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No submissions found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;