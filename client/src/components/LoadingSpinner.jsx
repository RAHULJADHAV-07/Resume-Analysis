const LoadingSpinner = ({ message = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="spinner border-4 border-gray-200 border-t-indigo-600 rounded-full w-16 h-16"></div>
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
