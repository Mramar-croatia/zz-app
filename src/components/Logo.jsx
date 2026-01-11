export default function Logo({ size = 48, className = '' }) {
  const combinedClassName = ['rounded-full', 'object-cover', className].filter(Boolean).join(' ');

  return (
    <img
      src="/logo.png"
      width={size}
      height={size}
      alt="Logo"
      className={combinedClassName}
    />
  );
}
