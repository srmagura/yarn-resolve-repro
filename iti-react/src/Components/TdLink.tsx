import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

/* TdLink has styles that are required for it to work correctly.
 *
 * Usage:
 *
 * <table className="table table-hover table-td-link">
 *     <tbody>
 *         {products.map(p => {
 *             const Td = getTdLink('/product/detail/' + p.id)
 *
 *             return (
 *                 <tr key={p.id}>
 *                     <Td>{p.id}</Td>
 *                     <Td>{p.name}</Td>
 *                     <Td>{p.stock}</Td>
 *                 </tr>
 *             )
 *          })}
 *     </tbody>
 * </table>
 */

type TdLink = React.FunctionComponent<Omit<LinkProps, 'to'>>

export function getTdLink(
    to: string,
    tdProps?: React.HTMLProps<HTMLTableCellElement>
): TdLink {
    const TdLink: TdLink = (props) => {
        const { children, className, ...otherProps } = props

        const classes = ['td-link']
        if (className) classes.push(className)

        return (
            <td {...tdProps}>
                <Link to={to} className={classes.join(' ')} {...otherProps}>
                    {children}
                </Link>
            </td>
        )
    }

    return TdLink
}
