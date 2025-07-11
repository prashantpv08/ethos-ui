import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout(): JSX.Element {
  return (
    <>
      <div className="main">
        <Header />
        <div className="mainContainer">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}
