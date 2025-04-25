import "./PlaceholderPage.css"

const PlaceholderPage = ({ title }) => {
  return (
    <div className="placeholder-container">
      <div className="placeholder-card">
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-text">This page is under construction. Please check back later.</p>
      </div>
    </div>
  )
}

export default PlaceholderPage
