let script = location.hash

if(script) script = script.replace(/^#/, './')
else script = './tisshubox'

require(script)
