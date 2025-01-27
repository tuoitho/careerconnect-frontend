import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { companyService } from "../services/companyService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const InvitationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await companyService.getInvitation(token);
      setInvitation(response.result);
    } catch (error) {
      toast.error("Invalid or expired invitation");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const response = await companyService.acceptInvitation(token);
      if (response) {
        toast.success(response.message);
        setInvitation(response.result);
      }
    } catch (error) {
      toast.error("Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  const isExpired =
    invitation?.expiryDate && new Date(invitation.expiryDate) < new Date();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invitation to Join {invitation?.companyName}
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-medium">Invited by:</span>{" "}
                {invitation?.inviterName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {invitation?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Expires:</span>{" "}
                {invitation?.expiryDate}
              </p>
            </div>
          </div>

          <div className="mt-6">
            {invitation?.accepted ? (
              <div className="text-center py-3 bg-green-50 text-green-800 rounded-md">
                This invitation has been accepted
              </div>
            ) : isExpired ? (
              <div className="text-center py-3 bg-red-50 text-red-800 rounded-md">
                This invitation has expired
              </div>
            ) : (
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {accepting ? "Accepting..." : "Accept Invitation"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
