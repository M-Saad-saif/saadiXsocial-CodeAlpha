import { useState } from 'react';
import { FiSettings, FiUser, FiLock, FiTrash2 } from 'react-icons/fi';
import EditProfileModal from './EditProfileModal';
import DeleteAccountModal from './DeleteAccountModal';
import '../styles/AccountSettings.css';

const AccountSettings = ({ user, onProfileUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditProfile = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleDeleteAccount = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleProfileUpdate = (updatedUser) => {
    onProfileUpdate(updatedUser);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="account-settings">
        {/* Settings Button */}
        <button
          className="settings-button"
          onClick={() => setShowMenu(!showMenu)}
          title="Account Settings"
        >
          <FiSettings />
          <span>Settings</span>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div 
              className="settings-backdrop" 
              onClick={() => setShowMenu(false)}
            />
            <div className="settings-dropdown">
              <button
                className="settings-menu-item"
                onClick={handleEditProfile}
              >
                <FiUser />
                <div>
                  <span className="item-title">Edit Profile</span>
                  <span className="item-description">Update your profile information</span>
                </div>
              </button>

              <button
                className="settings-menu-item"
                onClick={handleEditProfile}
              >
                <FiLock />
                <div>
                  <span className="item-title">Change Password</span>
                  <span className="item-description">Update your account password</span>
                </div>
              </button>

              <div className="settings-divider"></div>

              <button
                className="settings-menu-item danger"
                onClick={handleDeleteAccount}
              >
                <FiTrash2 />
                <div>
                  <span className="item-title">Delete Account</span>
                  <span className="item-description">Permanently remove your account</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default AccountSettings;