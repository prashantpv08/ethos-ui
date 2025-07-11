import { Link } from 'react-router-dom'
import { navigation } from '../Utils/constantData'
import { useEffect, useRef } from 'react'

let scrollBottom = ['/company-management', '/roles', '/productions', '/requests']

export default function SideNavigation() {
  const listRef: any = useRef(null)
  function isHashUrl(url: any) {
    return url.includes('/#/')
  }
  const currentHref = isHashUrl(window.location.href)
    ? window.location.hash.includes('?')
      ? `/${window.location.hash.split('?')[0].split('/')[1]}`
      : `/${window.location.hash.split('/')[1]}`
    : `/${window.location.pathname.split('/')[1]}`

  useEffect(() => {
    if (scrollBottom.includes(currentHref)) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  },[currentHref])

  return (
    <div className="navigation">
      <ul ref={listRef}>
        {navigation.map((values, index: number) => (
          <li key={index}>
            <Link
              to={values.path[0]}
              className={
                values.path.includes(`${currentHref}`) ? `activeLink` : ''
              }
              aria-label={`Navigate to ${values.name} page`}
            >
              <img
                src={
                  values.path.includes(`${currentHref}`)
                    ? values.icon_active
                    : values.icon
                }
                alt=""
                role="presentation"
              />
              {values.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
