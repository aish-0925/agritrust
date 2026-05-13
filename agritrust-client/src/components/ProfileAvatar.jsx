export default function ProfileAvatar({ user, size = "md", preview }) {

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-xl"
  };

  // Loading state
  if (!user) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gray-200 animate-pulse`} />
    );
  }

  const imageSrc =
  preview ||
  (user?.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : null);

  // If image exists
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt="profile"
        className={`${sizes[size]} rounded-full object-cover border border-gray-200 shadow-sm`}
      />
    );
  }

  // Fallback initial
  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white 
      bg-gradient-to-br from-green-500 to-green-700 shadow-sm`}
    >
      {initial}
    </div>
  );
}