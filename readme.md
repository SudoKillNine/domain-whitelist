# Domain Whitelist

This extension prevents the browser from loading websites from non-whitelisted domains.

In the context of Qubes OS, it is just a safeguard to avoid going on domains from Qubes that shouldn't access to them.

## Why

On Qubes OS the firewall based on IPs is not capable to handle sites that use load balancing.

Because of that a web firewall that works on http level and allows only certain domains may be great. But with https it is impossible to know the targeted domain. Even with SNI in TCP handshaking, the case where an allowed page loads contents from another not allowed domain will be blocked.

That's why, to act only as a safeguard, the browser extension is the best option : it has access to all requests and headers and can easily know if a request is initiated by the allowed domain even if loading external content.

The problem is that extensions on the market place :
 - are not trusted
 - are to big :
   - too much code to review
   - unused features
   - more code = more bugs
 - each update should be carefully checked

That's the reason of this one : small an under my control.
