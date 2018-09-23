# Web Chat hosted samples

Here you can find all hosted samples of [Web Chat](https://github.com/Microsoft/BotFramework-WebChat). The source code repository can be found on [GitHub](https://github.com/Microsoft/BotFramework-WebChat/tree/preview/samples).

> These samples are connected to MockBot, a bot for testing various features of Web Chat. The source code of MockBot can be found on [GitHub](https://github.com/compulim/BotFramework-MockBot).

## Basics

This section covers samples helping you to jumpstart embedding Web Chat in your existing web site.

### Thru CDN

For simplicity, you can use a `<script>` tag to embed Web Chat from a CDN.

- [Full bundle](https://microsoft.github.io/BotFramework-WebChat/full-bundle)
- [Minimal bundle](https://microsoft.github.io/BotFramework-WebChat/minimal-bundle)
- [Minimal bundle with Markdown](https://microsoft.github.io/BotFramework-WebChat/minimal-bundle-with-markdown)

### Thru NPM (as a React component)

You can also embed Web Chat as a React component from NPM. This is a more advanced approach and requires knowledge of React and bundling.

This approach will give you lots of flexibility to style and customize the component, including breaking down Web Chat into pieces and recompose back into a component.

- [Integrate with React](https://microsoft.github.io/BotFramework-WebChat/integrate-with-react)

## Styling

Web Chat can be styled in many ways without too much coding.

- [Avatar initials](https://microsoft.github.io/BotFramework-WebChat/avatar-initials)
- [Custom style options](https://microsoft.github.io/BotFramework-WebChat/custom-style-options)
- [Custom style set](https://microsoft.github.io/BotFramework-WebChat/custom-style-set)
- [Presentation mode](https://microsoft.github.io/BotFramework-WebChat/presentation-mode)

## Customization

If styling cannot met your need, you can customize Web Chat by extend the render pipeline or break it down and recompose it.

### Activity and attachment

To add, decorate, replace, or remove activity or attachment, these samples will give you a headstart.

- [Activity decorator: Button](https://microsoft.github.io/BotFramework-WebChat/activity-decorator-button)
- [Activity decorator: Highlight](https://microsoft.github.io/BotFramework-WebChat/activity-decorator-highlight)
- [Custom attachment: GitHub repository](https://microsoft.github.io/BotFramework-WebChat/custom-attachment-github-repository)

## Backchannel

On your web site, instead of connecting to your backend thru REST/Web Socket API, you can also connect thru Direct Line activities. This gives you flexibility of delivering content to your users.

- [Pipe activities to Redux as actions](https://microsoft.github.io/BotFramework-WebChat/redux-activity-middleware/build)
