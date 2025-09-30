export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="w-full pb-2 border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="p-2 rounded-full bg-gray-800 ring-2 ring-indigo-500/30 text-indigo-400">
          {icon} 
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 tracking-tight">
          {title}
        </h2>
      </div>
      
      <p className="text-sm sm:text-base text-gray-400 pl-14 mt-1">
        {subtitle}
      </p>
    </div>
  );
}