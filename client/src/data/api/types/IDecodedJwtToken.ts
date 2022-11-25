interface IJwtDecodedToken {
  typ: string;
  alg: string;
  kid: string;

  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;

  aio: string;
  azp: string;
  azpacr: number;
  name: string;
  oid: string;
  preferred_username: string;
  rh: string;
  roles: string[];

  scp: string;
  sub: string;
  tid: string;
  uti: string;
  ver: string;
}

export default IJwtDecodedToken;
