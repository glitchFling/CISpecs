const { execSync } = require('child_process');
const os = require('os');

function runCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8' }).trim();
    } catch (error) {
        return 'Not available / Failed to fetch';
    }
}

console.log('==================================================');
console.log('   GITHUB ACTIONS CI ENVIRONMENT SPECIFICATIONS   ');
console.log('==================================================\n');

// 1. SYSTEM GENERAL
console.log('--- [1] Operating System Information ---');
console.log(`Platform:         ${os.platform()}`);
console.log(`Release:          ${os.release()}`);
console.log(`Architecture:     ${os.arch()}`);
console.log(`Shell:            ${process.env.SHELL || 'N/A'}\n`);

// 2. CPU DETAILS
console.log('--- [2] CPU Specifications ---');
const cpus = os.cpus();
if (cpus && cpus.length > 0) {
    console.log(`Model:            ${cpus[0].model}`);
    console.log(`Physical Cores:   ${cpus.length}`);
    console.log(`Clock Speed:      ${cpus[0].speed} MHz`);
} else {
    console.log('CPU details not found via OS module.');
}

// Platform specific deep dives
if (os.platform() === 'linux') {
    console.log('\nDetailed Linux CPU Info:');
    const cpuInfo = runCommand('cat /proc/cpuinfo | grep "model name" | head -n 1');
    console.log(`Proc Info:        ${cpuInfo}`);
} else if (os.platform() === 'darwin') {
    console.log('\nDetailed macOS CPU Info:');
    console.log(`Brand:            ${runCommand('sysctl -n machdep.cpu.brand_string')}`);
}
console.log('');

// 3. RAM / MEMORY
console.log('--- [3] Memory (RAM) Allocation ---');
const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
console.log(`Total System RAM: ${totalMemoryGB} GB`);
console.log(`Free System RAM:  ${freeMemoryGB} GB\n`);

// 4. STORAGE / DISK SPACE
console.log('--- [4] Storage Allocation ---');
if (os.platform() === 'linux' || os.platform() === 'darwin') {
    console.log(runCommand('df -h /'));
} else if (os.platform() === 'win32') {
    console.log(runCommand('wmic logicaldisk get size,freespace,caption'));
}
console.log('');

// 5. GPU ACCELERATION CHECK
console.log('--- [5] GPU Acceleration Status ---');
if (os.platform() === 'linux') {
    const nvidiaCheck = runCommand('lspci | grep -i nvidia || nvidia-smi -L');
    console.log(`Graphics Hardware: ${nvidiaCheck}`);
} else if (os.platform() === 'darwin') {
    console.log(`Graphics Hardware: ${runCommand('system_profiler SPDisplaysDataType | grep "Chipset Model"')}`);
} else {
    console.log('GPU lookup skipped or unhandled platform.');
}
console.log('\n==================================================');
