import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import IssueFilters from '../components/Issues/IssueFilters';
import IssueCard from '../components/Issues/IssueCard';
import Loader from '../components/Common/Loader';
import Pagination from '../components/Common/Pagination';
import issueService from '../services/issueService';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';

const IssuesPage = ({ userOnly = false }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  const { showError } = useAlert();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 12
  });

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [filters, user]);


  const fetchIssues = async () => {
    setLoading(true);
    try {
      // Update URL params
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });
      setSearchParams(params);

      // Fetch issues
      let response;

      if (user && user.role === "admin") {
        response = await issueService.getIssues(filters);
      } else {
        response = await issueService.getUserIssues();
      }


      setIssues(response.data);
      setPagination({
        page: filters.page,
        limit: filters.limit,
        total: response.total || response.data.length,
        pages: Math.ceil((response.total || response.data.length) / filters.limit)
      });
    } catch (error) {
      showError('Issues लोड करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page on filter change
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && issues.length === 0) return <Loader />;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === "admin" ? 'सभी Issues' : 'मेरे Reported Issues'}

      </h1>

      {/* Filters */}
      {user?.role === "admin" &&
        <IssueFilters
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      }

      {/* Issues Grid */}
      {issues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {userOnly
              ? 'आपने अभी तक कोई issue report नहीं किया है'
              : 'कोई issue नहीं मिला'}
          </p>
          {userOnly && (
            <Link
              to="/create-issue"
              className="btn-primary inline-block mt-4"
            >
              पहला Issue Report करें
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map(issue => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>

          {/* Pagination */}
          {user?.role === "admin" && pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IssuesPage;