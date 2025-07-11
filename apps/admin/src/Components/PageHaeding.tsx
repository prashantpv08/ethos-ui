import { useNavigate } from "react-router-dom";

// import { Breadcrumbs } from '@mui/material'
// import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface Props {
  buttonChildren?: any;
  pageTitle: String;
  pageName?: string;
  backMethod?: any;
}

export default function PageHeading(props: Props) {
  const { buttonChildren, pageTitle, pageName, backMethod } = props;
  const navigate = useNavigate();

  // console.log(backMethod)

  return (
    <div className="pageHeading">
      <div className="headings">
        <h3>{pageTitle}</h3>

        {pageName ? (
          <ul className="breadCrums">
            <li
              onClick={() =>
                pageTitle === pageTitle
                  ? backMethod
                    ? backMethod()
                    : navigate(-1)
                  : undefined
              }
            >
              {pageTitle}
            </li>
            <li>{pageName}</li>
          </ul>
        ) : null}
      </div>
      <div className="buttons">{buttonChildren}</div>
    </div>
  );
}

// interface BreadcrumbItem {
//   title: string
//   onClick?: () => void
// }

// interface Props {
//   buttonChildren?: JSX.Element | JSX.Element[] | Function
//   pageTitle: string
//   breadcrumbs?: BreadcrumbItem[]
// }

// export default function PageHeading(props: Props) {
//   const { buttonChildren, pageTitle, breadcrumbs } = props

//   console.log({ breadcrumbs })

//   return (
//     <div className="pageHeading">
//       <div className="headings">
//         <h3>{pageTitle}</h3>

//         <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
//           {breadcrumbs && breadcrumbs.length > 0 && (
//             <ul className="breadCrums">
//               {breadcrumbs.map((item, index) => (
//                 <li key={index} onClick={item.onClick}>
//                   {item.title}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </Breadcrumbs>
//       </div>
//       <div className="buttons">{buttonChildren}</div>
//     </div>
//   )
// }
