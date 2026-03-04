import AccountDetail from '../../../components/Admin/AccountDetail';
import AccountList from '../../../components/Admin/AccountList';

export default function AccountManager({ users, isLoading, selectedUser, setSelectedUser, loadData, onUserUpdated, setStatusModal, openCreate, setProcessingMessage }) {
    if (selectedUser) {
        return (
            <AccountDetail
                user={selectedUser}
                onBack={() => setSelectedUser(null)}
                onUserUpdated={onUserUpdated}
                onUserDeleted={() => {
                    loadData();
                    setStatusModal({
                        isOpen: true,
                        type: 'success',
                        title: 'Account Deleted',
                        message: `Account for ${selectedUser.first_name} has been permanently removed.`
                    });
                }}
                setProcessingMessage={setProcessingMessage}
            />
        );
    }

    return (
        <AccountList
            users={users}
            isLoading={isLoading}
            onSelectUser={setSelectedUser}
            onCreate={openCreate}
        />
    );
}
