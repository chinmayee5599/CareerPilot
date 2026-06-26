import { useState, useMemo } from 'react';
import { Briefcase, MapPin, IndianRupee, TrendingUp, Filter, Search, ChevronRight, Star } from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

function MatchCard({ match }: { match: ReturnType<typeof useDemoData>['matches'][0] }) {
  const [expanded, setExpanded] = useState(false);
  const matchColor = match.match_pct >= 80 ? 'text-emerald-600' : match.match_pct >= 60 ? 'text-amber-500' : 'text-slate-500';
  const matchBg = match.match_pct >= 80 ? 'bg-emerald-50' : match.match_pct >= 60 ? 'bg-amber-50' : 'bg-slate-50';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: match.logo_color || '#3b82f6' }}
          >
            {match.logo_letter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">{match.company}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{match.role}</p>
              </div>
              <div className={`text-right flex-shrink-0 ${matchBg} rounded-lg px-3 py-1.5`}>
                <span className={`text-lg font-bold ${matchColor}`}>{match.match_pct}%</span>
                <p className="text-[10px] text-slate-500 font-medium">MATCH</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
              {match.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {match.location}
                </span>
              )}
              {match.salary_range && (
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5" /> {match.salary_range}
                </span>
              )}
              {match.is_new && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium text-[10px]">
                  NEW
                </span>
              )}
            </div>

            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {expanded ? 'Hide details' : 'View details'}
                <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-emerald-600 uppercase mb-2 flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> Skills Matched
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {match.skills_matched.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-amber-600 uppercase mb-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Skills to Add
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {match.skills_missing.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              Apply Now
            </button>
            <button className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              Save for Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareerMatch() {
  const { matches } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMinMatch, setFilterMinMatch] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchesSearch = !searchQuery ||
        m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = m.match_pct >= filterMinMatch;
      return matchesSearch && matchesFilter;
    }).sort((a, b) => b.match_pct - a.match_pct);
  }, [matches, searchQuery, filterMinMatch]);

  const avgMatch = Math.round(matches.reduce((sum, m) => sum + m.match_pct, 0) / matches.length);
  const newMatches = matches.filter(m => m.is_new).length;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Career Match</h1>
        <p className="text-slate-500 mt-1">AI-powered job matching based on your resume and skills.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{matches.length}</p>
          <p className="text-xs text-slate-500">Total Matches</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{avgMatch}%</p>
          <p className="text-xs text-slate-500">Avg Match Score</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{newMatches}</p>
          <p className="text-xs text-slate-500">New This Week</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="text-sm text-slate-600 block mb-2">
              Minimum Match: {filterMinMatch}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterMinMatch}
              onChange={e => setFilterMinMatch(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No matches found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredMatches.map(match => <MatchCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  );
}
