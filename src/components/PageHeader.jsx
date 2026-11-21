export default function PageHeader({ eyebrow, title, text }) {
  return (
    <div className="page-hero">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p className="lede">{text}</p>
    </div>
  )
}
