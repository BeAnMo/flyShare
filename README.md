<h1>flyShare</h1>

<p>flyShare is a file-sharing service built off of Node.js with 
the Express.js framework and Mozilla's experimental <a href="https://flyweb.github.io/">FlyWeb</a>.</p>

Node modules required:
<ul>
  <li>express</li>
  <li>multer</li>
  <li>mdns</li>
  <li>mime</li>
</ul>

<h4>To setup & run as a host:</h4>
<ol>
  <li><code>git clone https://github.com/beanmo/flyshare</code></li>
  <li>Change to flyShare directory</li>
  <li>Open a terminal: <code>node server [serverName] [portNumber]</code></li>
</ol>
flyShare on host machine: <code>http://localhost:[portNumber]</code>.
<br/>
<h4>Accessing as a user:</h4>
<ol>
  <li>Download & install either <a href="https://www.mozilla.org/en-US/firefox/channel/desktop/">Firefox Nightly or Developer Edition</a></li>
  <li>Type <code>about:config</code> into the address bar</li>
  <li>Search for <code>flyweb</code></li>
  <li>Right click <code>dom.flyweb.enabled</code> and toggle so that <code>value</code> is set to <code>true</code>
  <li>Open the toolbar menu and go to customize, FlyWeb icon will be available to add to the menu</li>
  <li>Clicking on the FlyWeb icon will show FlyWeb servers available</li>
</ol>


At this time, the host must manually delete entries from shared.json and remove files from the Downloads directory.
