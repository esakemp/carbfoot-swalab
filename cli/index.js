const inquirer = require('inquirer')
const { spawn, execSync } = require('child_process')

const CWD = '..'

const getServices = () => {
    const buffer = execSync('docker-compose config --services', { cwd: CWD })
    const output = buffer.toString()
    const services = output.split('\n').filter(s => !!s)
    return services
}

const makeDockerComposeCommand = (cmd) => (args=[]) => new Promise((resolve, reject) => {
    spawn('docker-compose', [...cmd, ...args], { stdio: 'inherit', cwd: CWD })
        .on('exit', resolve)
        .on('error', reject)
})

const compose = {
    up: makeDockerComposeCommand(['up', '-d']),
    down: makeDockerComposeCommand(['down']),
    logs: makeDockerComposeCommand(['logs', '-f'])
}

const promptServices = async () => {
    const available = getServices()
    const { services } = await inquirer.prompt({
        name: 'services',
        type: 'checkbox',
        choices: available
    })
    return services
}

const promptAction = async (choices) => {
    const { action } = await inquirer.prompt({
        name: 'action',
        type: 'list',
        choices
    })
    return action
}

const ACTIONS = [{
        name: 'docker-compose up',
        callback: async () => {
            const services = await promptServices()
            await compose.up(services)
        }
    }, {
        name: 'docker-compose down',
        callback: async () => {
            await compose.down()
        }
    }, {
        name: 'docker-compose logs',
        callback: async () => {
            const services = await promptServices()
            await compose.logs(services)
        }
    }
]

const main = async () => {
    const choices = ACTIONS.map(({ name }) => name)
    while (true) {
        const action = await promptAction(choices)
        const { callback } = ACTIONS.find(a => a.name === action)
        await callback()
    }
}

main()