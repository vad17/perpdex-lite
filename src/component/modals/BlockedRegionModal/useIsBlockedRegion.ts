import { useState, useEffect } from "react"
import { logger } from "lib/bugsnag/logger"

export function useIsBlockedRegion() {
    const [isBlockedRegion, setIsBlockedRegion] = useState(false)

    useEffect(() => {
        const blockedList = process.env.REACT_APP_BLOCKED_REGION?.split(",") || []
        if (blockedList.length === 0) {
            return
        }
        try {
            fetch("https://www.cloudflare.com/cdn-cgi/trace")
                .then(res => res.text())
                .then(text => {
                    const ret: Record<string, string> = {}
                    text.split("\n").forEach(line => {
                        const [key, value] = line.split("=")
                        ret[key] = value
                    })
                    const isBlocked = blockedList.some(location => location === ret.loc)
                    setIsBlockedRegion(isBlocked)
                })
                .catch(err => {
                    setIsBlockedRegion(true)
                    console.error(err)
                })
        } catch (err) {
            setIsBlockedRegion(true)
            logger.error(err)
        }
    }, [setIsBlockedRegion])

    return isBlockedRegion
}
