const Card = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          {title && <h3 className="text-base font-semibold text-gray-800">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-0">{children}</div>
    </div>
  );
};

export default Card;
