function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {value}
          </h2>
        </div>

        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={25} />
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        {subtitle}
      </p>

    </div>
  );
}

export default StatCard;