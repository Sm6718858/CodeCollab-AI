export default function SectionHeader({ iconPath, title, subtitle }) {
  return (
    <div className="w-full px-4 py-3 sm:px-6 md:px-8">
      <div className="flex items-center space-x-3">
        <svg
          className="w-6 h-6 text-accent"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d={iconPath} stroke="currentColor" strokeWidth="2" />
        </svg>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
          {title}
        </h2>
      </div>
      <p className="text-sm sm:text-base text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
