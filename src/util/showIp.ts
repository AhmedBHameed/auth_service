import {networkInterfaces} from 'os';

const showIp = (onInterface = 'eth0'): string[] => {
  const IPs: string[] = [];
  const interfaces = networkInterfaces();

  Object.keys(interfaces).forEach((interfaceName: string) => {
    interfaces[interfaceName]?.forEach((iface) => {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      if (iface.family !== 'IPv4' || iface.internal !== false) return;

      if (onInterface === 'eth0') {
        IPs.push(iface.address);
      }
    });
  });

  return IPs;
};

export default showIp;
