import React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbItemComponentProps {
    item: BreadcrumbItem
    last: boolean
}

function BreadcrumbItemComponent({
    item,
    last,
}: BreadcrumbItemComponentProps): JSX.Element {
    return (
        <li className={`breadcrumb-item ${last ? '' : 'active'}`}>
            {last ? <span>{item.label}</span> : <Link to={item.path}>{item.label}</Link>}
        </li>
    )
}

export interface BreadcrumbItem {
    label: string
    path: string
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps): React.ReactElement {
    if (!items || items.length <= 1) {
        return <div className="breadcrumbs" />
    }

    return (
        <div className="breadcrumbs">
            <ol className="breadcrumb">
                {items.map((item, i) => (
                    <BreadcrumbItemComponent
                        item={item}
                        last={i === items.length - 1}
                        key={item.path}
                    />
                ))}
            </ol>
        </div>
    )
}
