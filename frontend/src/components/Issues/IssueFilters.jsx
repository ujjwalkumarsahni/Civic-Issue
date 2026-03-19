import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const categories = [
  'सभी',
  'Garbage',
  'Water Leakage',
  'Road Damage',
  'Street Light',
  'Other'
];

const statuses = [
  'सभी',
  'pending',
  'in_progress',
  'resolved',
  'rejected'
];

const IssueFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || 'सभी',
    status: initialFilters.status || 'सभी',
    search: initialFilters.search || '',
    sort: initialFilters.sort || '-createdAt',
  });
  
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const newFilters = {
      category: 'सभी',
      status: 'सभी',
      search: '',
      sort: '-createdAt',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="खोजें... (title, description)"
            className="input-field pl-10"
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
        >
          खोजें
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center"
        >
          <FaFilter className="mr-2" />
          फिल्टर
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">फिल्टर विकल्प</h3>
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 flex items-center text-sm"
            >
              <FaTimes className="mr-1" /> साफ करें
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'सभी' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status === 'सभी' ? '' : status}>
                    {status === 'pending' ? 'लंबित' :
                     status === 'in_progress' ? 'प्रगति पर' :
                     status === 'resolved' ? 'हल हो गया' :
                     status === 'rejected' ? 'अस्वीकृत' : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                क्रमबद्ध करें
              </label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
                className="input-field"
              >
                <option value="-createdAt">नया सबसे पहले</option>
                <option value="createdAt">पुराना सबसे पहले</option>
                <option value="-upvotes">सबसे ज्यादा Upvotes</option>
                <option value="upvotes">सबसे कम Upvotes</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueFilters;