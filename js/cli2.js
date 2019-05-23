/* global $, localStorage, Shell */

const errors = {
  invalidDirectory: 'Error: not a valid directory',
  noWriteAccess: 'Error: you do not have write access to this directory',
  fileNotFound: 'Error: file not found in current directory',
  fileNotSpecified: 'Error: you did not specify a file'
}

const struct = {
  root: ['about', 'resume', 'contact', 'talks'],
  projects: ['nodemessage', 'map', 'dotify', 'slack_automation'],
  skills: ['proficient', 'familiar', 'learning']
}

const commands = {}
let systemData = {}
const vars = {
  about: "<p>Hi I'm <br><h2><strong>Aayush Sarkar</strong></h2>A Web | APP | Python developer based in New Delhi, India.<br><br>Passionate about UX designing and writing automation scripts. I am AI enthusiast while maintain a blog of short horror stories on the side. </p>",
  resume: "<a class='blue' target='_blank' href='data/resume.pdf'>View My Resume</a>",
  contact: "<ul class='contact'><li><a class='blue' target='_blank' href='https://github.com/xacrolyte'>GitHub</a></li><li><a class='blue' target='_blank' href='https://www.behance.net/sarkaraayu764d'>Behance</a></li><li><a class='blue' target='_blank' href='https://www.linkedin.com/in/aayush-sarkar-xacrolyte'>LinkedIn</a></li><li><a class='blue' target='_blank' href='https://www.instagram.com/xacrolyte/'>Instagram</a></li></ul>",
  roots: "<p>about.txt &nbsp&nbsp <span class='dir'>projects</span> &nbsp&nbsp <span class='dir'>skills</span><br>contact.txt &nbsp&nbsp resume.txt<br></p>",
  projects: "<ul class='proj'><li><a class='blue' target='_blank' href='https://github.com/Xacrolyte/Cubexi-Profile'>Cubexi</a></li><li><a class='blue' target='_blank' href='https://github.com/Xacrolyte/pipenv'>PIP-ENV</a></li><li><a class='blue' target='_blank' href='https://github.com/Xacrolyte/OCR-Matlab'>OCR-MATLAB</a></li><li><a class='blue' target='_blank' href='https://github.com/Xacrolyte/Number-Recognition'>OCR-Analysis</a></li><li><a class='blue' target='_blank' href='https://github.com/Xacrolyte/PyCon-Mobile-App'>Pycon-Mobile-App</a></li></ul>",
  skills: "<div><ul><strong><h4>SKILLS</h4></strong><li><strong>Web Dev (html,css,django,reactjs,js,jquery)</strong> - #########################</li><li><strong>Python (opencv,tensorflow,bs4,pandas,regex)</strong> - ###################</li><li><strong>Android Dev (java,xml,kivy,flutter)</strong> &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp- #####################</li><li><strong>UI/UX Design (XD,photoshop,illustrator)</strong> &nbsp&nbsp&nbsp&nbsp- #########################</li><li><strong>Machine Learning (IBM,AWS,tensorflow,cv2)</strong> &nbsp&nbsp- ##############</li></ul></div>",
  help: "<div> <ul> <li><strong>path</strong> - display current directory</li><li><strong>cat FILENAME</strong> - display FILENAME in window</li><li><strong>cd DIRECTORY</strong> - move into DIRECTORY or just cd to return to root</li><li><strong>ls</strong> - show files in current directory</li><li><strong>history</strong> - see your command history</li><li><strong>clear</strong> - clear current window</ul></div>",
}
const rootPath = 'users/xacrolyte/root'

const getDirectory = () => localStorage.directory
const setDirectory = (dir) => { localStorage.directory = dir }

// turn on fullscreen   
const registerFullscreenToggle = () => {
  $('.button.green').click(() => {
    $('.terminal-window').removeClass('normscreen')
    $('.terminal-window').addClass('fullscreen')
  })
}

// turn off fullscreen
const registerNFullscreenToggle = () => {
  $('.button.yellow').click(() => {

    $('.terminal-window').removeClass('fullscreen')
    $('.terminal-window').addClass('normscreen')
  })
}

// create new directory in current directory
commands.mkdir = () => errors.noWriteAccess

// create new directory in current directory
commands.touch = () => errors.noWriteAccess

// remove file from current directory
commands.rm = () => errors.noWriteAccess

// view contents of specified directory
commands.ls = () => {
  
  const dir = getDirectory()
  
  if (dir === '..' || dir === '~' || dir === "") {
    return vars.roots
    //return systemData['root']
  }
  
  else if (dir === 'projects') {
    return vars.projects  
  }

  else if (dir === 'skills') {
    return vars.skills
  }

  return vars.roots
  //return systemData[getDirectory()]
}

// view list of possible commands
commands.help = () => {
  return vars.help
}

// display current path
commands.path = () => {
  const dir = getDirectory()
  return dir === 'root' ? rootPath : `${rootPath}/${dir}`
}

// see command history
commands.history = () => {
  let history = localStorage.history
  history = history ? Object.values(JSON.parse(history)) : []
  return `<p>${history.join('<br>')}</p>`
}

// move into specified directory
commands.cd = (newDirectory) => {
  const currDir = getDirectory()
  const dirs = Object.keys(struct)
  const newDir = newDirectory ? newDirectory.trim() : ''

  if (dirs.includes(newDir) && currDir !== newDir) {
    setDirectory(newDir)
  } else if (newDir === '' || newDir === '~' || (newDir === '..' && dirs.includes(currDir))) {
    setDirectory('root')
  } else {
    return errors.invalidDirectory
  }
  return null
}

// display contents of specified file
commands.cat = (filename) => {
  if (!filename) return errors.fileNotSpecified

  const dir = getDirectory()
  const fileKey = filename.split('.')[0]

  if (fileKey == "about") {
    return vars.about
  }

  if (fileKey == "resume") {
    return vars.resume
  }

  if (fileKey == "contact") {
    return vars.contact
  }

  return errors.fileNotFound
}

// initialize cli
$(() => {
  registerNFullscreenToggle()
  registerFullscreenToggle()
  const cmd = document.getElementById('terminal')
  const terminal = new Shell(cmd, commands)

  $.ajaxSetup({ cache: false })
  $.get('./data/systemdata.json', (data) => {systemData = data})
})