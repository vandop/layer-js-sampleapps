# Sample apps using Layer Web SDK

This repository contains sample chat applications that use *Private Beta* version of the Layer Web SDK to demonstrate how one would use the SDK to build a simple chat application using one of these three popular frameworks:

 - [Backbone](./backbone)
 - [Angular](./angular)
 - [React](./react)

Each sample app implementation is framework specific and not necessarily a demonstration of best practice.

> These examples are built using the *Private Beta* version of the Layer Web SDK; the Web SDK is NOT ready for production use.

## The Web SDK

The Web SDK in all samples is loaded via script tag directly from our [CDN](http://static.layer.com/sdk/layer-private-beta.js). For more information on how the Web SDK works, see [Web SDK Docs](http://static.layer.com/sdk/docs).

## Authentication and identity

For demonstration purposes Layer provides a sample authentication endpoint which works for Layer **Staging Applications only** and a hard-coded list of users. It exposes a global `window.layerSample` utility and injects an initial HTML login dialog.

Layer Staging Application IDs can be found in your [Developer Dashboard](https://developer.layer.com/projects/keys).

> In real application this should be replaced with your own authentication mechanism and manage your own user identities.
