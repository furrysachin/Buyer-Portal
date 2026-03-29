const FloatingInput = ({ label, type = "text", className = "", ...props }) => {
  return (
    <label className={`floating-field ${className}`}>
      <input type={type} placeholder=" " className="peer" {...props} />
      <span>{label}</span>
    </label>
  );
};

export default FloatingInput;
