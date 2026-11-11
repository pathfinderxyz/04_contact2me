const paths = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V20h11V9.5" />
    </>
  ),
  megaphone: (
    <>
      <path d="M5 10v4l9 3V7L5 10z" />
      <path d="M14 8.5c1.6.6 2.5 1.8 2.5 3.5S15.6 15 14 15.5" />
      <path d="M7 14.5c.4 1.8 1 3 2.2 3.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="2.4" />
      <path d="M4.8 18c.6-2.2 2.2-3.3 4.2-3.3s3.6 1.1 4.2 3.3" />
      <circle cx="16" cy="9.5" r="2" />
      <path d="M15.2 14.8c1.5.2 2.8 1 3.5 3.2" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <circle cx="8.2" cy="10.2" r="1.6" />
      <path d="M12 9.6h5.2M12 12.4h5.2M7 14.6h10" />
    </>
  ),
  more: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  back: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m15.2 15.2 3.3 3.3" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 19.5a7.5 7.5 0 1 0-6.5-3.7L4.5 19.5l3.8-1A7.5 7.5 0 0 0 12 19.5z" />
      <path d="M9.2 10.2c.2 1.6 1.6 3.2 3.4 3.8.4.1.8 0 1-.3l.5-.8c.2-.2.1-.5-.1-.7l-.8-.5c-.2-.1-.5 0-.6.2l-.2.4" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </>
  ),
  phone: (
    <path d="M8 4.8h2.2l1 3-1.6 1a11 11 0 0 0 5.6 5.6l1-1.6 3 1V17a1.6 1.6 0 0 1-1.7 1.6A13.2 13.2 0 0 1 6.4 6.5 1.6 1.6 0 0 1 8 4.8z" />
  ),
  logout: (
    <>
      <path d="M10 6H7.2A1.2 1.2 0 0 0 6 7.2v9.6A1.2 1.2 0 0 0 7.2 18H10" />
      <path d="M11 12h8M16 8.5 19.5 12 16 15.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4.5 19.5h15" />
      <path d="M7 16V10M12 16V6M17 16v-3" />
    </>
  ),
  academy: (
    <>
      <path d="m3.5 10 8.5-4.5L20.5 10 12 14.5 3.5 10z" />
      <path d="M7 12.2V16c1.6 1.2 2.9 1.6 5 1.6s3.4-.4 5-1.6v-3.8" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5a3.5 3.5 0 0 0 5 .4l2-2a3.5 3.5 0 0 0-5-5l-1.1 1.1" />
      <path d="M14 10.5a3.5 3.5 0 0 0-5-.4l-2 2a3.5 3.5 0 0 0 5 5l1.1-1.1" />
    </>
  ),
  chat: (
    <>
      <path d="M5 16.5 3.8 20 8 18.2A8 8 0 1 0 5 16.5z" />
      <path d="M8.5 11h7M8.5 14h4.5" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7.5" />,
  eye: (
    <>
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="2.3" />
    </>
  ),
};

export function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Mark({ size = 36 }) {
  return (
    <span className="mark" style={{ width: size, height: size }} aria-hidden="true">
      <Icon name="whatsapp" size={size * 0.55} />
    </span>
  );
}
