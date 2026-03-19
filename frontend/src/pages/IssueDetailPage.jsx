import React from 'react';
import { useParams } from 'react-router-dom';
import IssueDetail from '../components/Issues/IssueDetail';

const IssueDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <IssueDetail issueId={id} />
    </div>
  );
};

export default IssueDetailPage;