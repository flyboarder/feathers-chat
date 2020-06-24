const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');

class JWTStrategy2 extends JWTStrategy {
  async authenticate (authentication: AuthenticationRequest, params: Params) {
    console.log("TESTING");
    const { accessToken } = authentication;
    const { entity } = this.configuration;

    if (!accessToken) {
      throw new NotAuthenticated('No access token');
    }

    const payload = await this.authentication.verifyAccessToken(accessToken, params.jwt);
    const result = {
      accessToken,
      authentication: {
        strategy: 'jwt',
        accessToken,
        payload
      }
    };

    if (entity === null) {
      return result;
    }

    const entityId = await this.getEntityId(result, params);
    const value = await this.getEntity(entityId, params);

    return {
      ...result,
      [entity]: value
    };
  }
}

module.exports = app => {
  const authentication = app.service('authentication');

  authentication.register('jwt2', new JWTStrategy2());

};
