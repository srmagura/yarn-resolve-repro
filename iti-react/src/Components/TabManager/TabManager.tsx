import $ from 'jquery'
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Location } from 'history'
import { defaults } from 'lodash'
import { Tab, TabLayout } from './TabLayout'
import { TabContentLoading } from './TabContentLoading'

const defaultUrlParamName = 'tab'

export function getTabFromLocation(
    tabs: Tab[],
    location: Location,
    options?: {
        defaultTabName?: string
        urlParamName?: string
    }
): string {
    if (tabs.length === 0) throw new Error('tabs array cannot be empty.')

    const { defaultTabName, urlParamName } = defaults(options, {
        urlParamName: defaultUrlParamName,
    })

    const searchParams = new URLSearchParams(location.search)
    const tabParam = searchParams.get(urlParamName)

    if (tabParam && tabs.some((t) => t[0] === tabParam)) return tabParam
    if (defaultTabName) return defaultTabName

    return tabs[0][0]
}

interface UseSmoothTabTransitionOutput {
    tabContentRef: React.RefObject<HTMLDivElement>
    explicitTabContentHeight: number | undefined
    newTabWillMount(): void
}

// When the user switches to a tab that needs to load first, keep the height
// of the tab-content the same until the new tab finishes loading to avoid
// jarring changes in height
function useSmoothTabTransition(
    renderTabs: RenderTab[],
    tab: string
): UseSmoothTabTransitionOutput {
    const tabContentRef = useRef<HTMLDivElement>(null)

    const [explicitTabContentHeight, setExplicitTabContentHeight] = useState<number>()
    const [setHeightTo, setSetHeightTo] = useState<number>()

    // When a new tab is about to mount, get the height of the tabContent
    // BEFORE the tabs actually switch
    function newTabWillMount(): void {
        if (tabContentRef.current) {
            const height = $(tabContentRef.current).outerHeight()
            if (typeof height === 'number') setSetHeightTo(height)
        }
    }

    // Explicitly set the tabContent height immediately after the new tab becomes
    // visible. useLayoutEffect is essential here because we want the effect to
    // run *before the browser paints*.
    useLayoutEffect(() => {
        if (typeof setHeightTo === 'number') {
            setExplicitTabContentHeight(setHeightTo)
            setSetHeightTo(undefined)
        }
    }, [setHeightTo])

    const currentRenderTab = renderTabs.find((rt) => rt[0] === tab)

    // Set explicit height to undefined when new tab becomes ready
    useLayoutEffect(() => {
        if (typeof explicitTabContentHeight === 'number') {
            if (currentRenderTab && currentRenderTab[1]) {
                setExplicitTabContentHeight(undefined)
            }
        }
    }, [explicitTabContentHeight, currentRenderTab])

    return { tabContentRef, explicitTabContentHeight, newTabWillMount }
}

//
//
//

type RenderTab = [
    string, // tabName
    boolean, // isTabReadyForDisplay (loading indicator shown if false)
    React.ReactNode
]

export type TabManagerRenderTab = RenderTab

interface TabManagerProps {
    tabs: Tab[]
    children: RenderTab[]

    defaultTabName?: string
    urlParamName?: string
    renderLoadingIndicator?: () => React.ReactElement | null
    mountAllTabs?: boolean
    displaySingleTab?: boolean
    className?: string
}

export function TabManager({
    tabs,
    children,
    defaultTabName,
    renderLoadingIndicator,
    mountAllTabs = false,
    urlParamName = defaultUrlParamName,
    displaySingleTab = true,
    className,
}: TabManagerProps): React.ReactElement | null {
    const history = useHistory()
    const location = useLocation()

    let tab = ''
    if (tabs.length > 0) {
        tab = getTabFromLocation(tabs, location, { defaultTabName, urlParamName })
    }

    const [mountedTabs, setMountedTabs] = useState<string[]>([tab])

    const { tabContentRef, explicitTabContentHeight, newTabWillMount } =
        useSmoothTabTransition(children, tab)

    useEffect(() => {
        if (mountAllTabs) return

        if (!mountedTabs.includes(tab)) {
            setMountedTabs((mountedTabs) => [...mountedTabs, tab])
        }
    }, [mountedTabs, tab, mountAllTabs])

    function onTabClick(tabName: string): void {
        if (!mountedTabs.includes(tabName)) newTabWillMount()

        const searchParams = new URLSearchParams(location.search)
        searchParams.set(urlParamName, tabName)

        history.replace({
            ...location,
            search: searchParams.toString(),
        })
    }

    function renderTab(theRenderTab: RenderTab): React.ReactElement | null {
        const [thisTabName, ready, reactNode] = theRenderTab

        if (!mountAllTabs && !mountedTabs.includes(thisTabName)) return null

        return (
            <div
                style={{
                    display: tab === thisTabName ? undefined : 'none',
                }}
                className={!ready ? 'render-tab-loading' : undefined}
                key={thisTabName}
            >
                {!ready && (
                    <TabContentLoading renderLoadingIndicator={renderLoadingIndicator} />
                )}
                <div className={ready ? '' : 'd-none'}>{reactNode}</div>
            </div>
        )
    }

    if (tabs.length === 1 && !displaySingleTab) {
        if (!children || children.length === 0) return null

        // Display contents without a tab or border
        return renderTab(children[0])
    }

    return (
        <TabLayout
            tabs={tabs}
            tab={tab}
            onTabClick={onTabClick}
            tabContentRef={tabContentRef}
            tabContentStyle={
                typeof explicitTabContentHeight === 'number'
                    ? { height: explicitTabContentHeight }
                    : undefined
            }
            className={className}
        >
            {children && children.map(renderTab)}
        </TabLayout>
    )
}
