import React from 'react';

interface ProfileButtonProps {
    username?: string;
    onClick?: () => void;
    avatarUrl?: string;
    classImg?:string
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ username, onClick, avatarUrl, classImg }) => {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '20px',
                transition: 'background 0.2s',
            }}
            aria-label={`Open profile menu for ${username}`}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={`${username}'s avatar`}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        marginRight: 8,
                        objectFit: 'cover',
                    }}
                    className={classImg}
                />
            ) : (
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#ccc',
                        marginRight: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: '#fff',
                        fontSize: 16,
                    }}
                >
                    {username?.charAt(0).toUpperCase()}
                </div>
            )}
            <span style={{ fontWeight: 500 }}>{username}</span>
        </button>
    );
};

export default ProfileButton;