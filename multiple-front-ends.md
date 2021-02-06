# Multiple front-ends for Wordpress

Wordpress has had a REST API for several years now, the earliest work on what is now the REST API began in 2013 for version 1 and in 2015 for the current version 2.

This technology caught my attention for several reasons


1. **It removes WordPress’s reliance on PHP.** The REST API enables a much wider pool of developers to interact with the platform, however. Expect to see developer and best practices from languages such as Ruby, Python, and Go to quickly start arriving
2. **It allows for new integrations beyond desktop browsers.** Since we can use any language we want to create front ends for Wordpress content
## Creating a web app front-end

```html
<div id="myContent"></div>

  <template id="post-list-template">

    {{#each posts}}
    <div class="post">
      <h1>{{title.rendered}}</h1>
      <div>
        {{{content.rendered}}}
      </div>
    </div>
    {{/each}}

  </template>
```


```javascript
let myPosts = fetch('https://publishing-project.rivendellweb.net/wp-json/wp/v2/posts?per_page=10')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    let template = document.getElementById('post-list-template').innerHTML;
    let renderPosts = Handlebars.compile(template);

    document.getElementById('myContent').innerHTML = renderPosts({
      posts: myJson
    })
  })

  .catch((err) => {
    console.log('There\'s been an error getting the data', err);
  });

```
