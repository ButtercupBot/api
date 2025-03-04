declare global {
    interface Window { butter: Butter; }
}

const oldLog = console.log;
// biome-ignore lint/suspicious/noExplicitAny: log can accept any
console.log = (...data: any[]) => {
    oldLog('[worker]', ...data);
};

console.log('loaded butter dep');

class Butter {
    meow = 'meow';
    reply = (message: string) => {
        self.postMessage({ type: 'reply', data: message });
        return true;
    };
}
self.butter = new Butter();
