const micromatch = require('micromatch')

module.exports = {
    '*.ts?(x)': files => {
        const tasks = []

        // Don't lint files in .eslintignore
        notIgnored = micromatch.not(files, '**/__tests__/**/*')

        if (notIgnored.length > 0) {
            tasks.push(`eslint --fix --max-warnings 0 ${notIgnored.join(' ')}`)
        }

        tasks.push(`prettier --write ${files.join(' ')}`)
        return tasks
    }
}
