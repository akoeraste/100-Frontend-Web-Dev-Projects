document.addEventListener('DOMContentLoaded', function () {
  var postsEl = document.getElementById('posts');
  var loader = document.getElementById('loader');

  var tags = ['JavaScript', 'CSS', 'React', 'Design', 'Web Dev', 'Tutorial', 'Tips'];
  var titles = [
    'Understanding CSS Grid Layout in Depth',
    'A Beginner\'s Guide to JavaScript Promises',
    'Building Responsive Layouts with Flexbox',
    'Top 10 VS Code Extensions for Web Developers',
    'How to Optimize Your Website Performance',
    'Introduction to React Hooks and State Management',
    'CSS Variables: The Complete Guide',
    'Working with REST APIs in JavaScript',
    'Modern JavaScript Features You Should Know',
    'Deploying Your First Web App to the Cloud',
    'Understanding the DOM and Event Handling',
    'Advanced CSS Animations and Transitions',
    'Clean Code Principles for Frontend Developers',
    'Building a Design System from Scratch',
    'TypeScript for JavaScript Developers',
    'Mastering Git and Version Control',
    'Web Accessibility Best Practices',
    'Creating Beautiful Dark Mode Interfaces',
    'State Management Patterns in React',
    'Debugging JavaScript Like a Pro'
  ];
  var excerpts = [
    'Learn the fundamentals and advanced techniques that will help you build better, more maintainable web applications.',
    'Dive deep into this essential topic with practical examples and clear explanations that you can apply to your projects.',
    'Discover the best practices and patterns used by professional developers to create high-quality user interfaces.',
    'This comprehensive guide covers everything you need to know, from basic concepts to real-world implementation strategies.'
  ];
  var authors = ['Alex Chen', 'Sarah Kim', 'James Park', 'Maya Johnson', 'Dev Patel'];

  var page = 0;
  var loading = false;
  var totalPages = 5;

  function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomDate() {
    var d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 90));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function generatePosts(count) {
    var posts = [];
    for (var i = 0; i < count; i++) {
      var imgId = 100 + page * count + i;
      posts.push({
        img: 'https://picsum.photos/id/' + imgId + '/640/300',
        tag: randomItem(tags),
        title: titles[(page * count + i) % titles.length],
        excerpt: randomItem(excerpts),
        author: randomItem(authors),
        date: randomDate(),
        readTime: (Math.floor(Math.random() * 8) + 3) + ' min read'
      });
    }
    return posts;
  }

  function renderPosts(posts) {
    posts.forEach(function (p) {
      var article = document.createElement('article');
      article.className = 'post';
      article.innerHTML =
        '<img class="post-img" src="' + p.img + '" alt="' + p.title + '" loading="lazy" />' +
        '<div class="post-body">' +
          '<span class="post-tag">' + p.tag + '</span>' +
          '<h2 class="post-title">' + p.title + '</h2>' +
          '<p class="post-excerpt">' + p.excerpt + '</p>' +
          '<div class="post-meta"><i class="fa-solid fa-user"></i> ' + p.author +
          ' <i class="fa-solid fa-calendar"></i> ' + p.date +
          ' <i class="fa-solid fa-clock"></i> ' + p.readTime + '</div>' +
        '</div>';
      postsEl.appendChild(article);
    });
  }

  function loadMore() {
    if (loading || page >= totalPages) return;
    loading = true;
    loader.classList.remove('hidden');

    setTimeout(function () {
      var posts = generatePosts(4);
      renderPosts(posts);
      page++;
      loading = false;
      if (page >= totalPages) {
        loader.classList.add('hidden');
      }
    }, 800);
  }

  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      loadMore();
    }
  });

  loadMore();
});
