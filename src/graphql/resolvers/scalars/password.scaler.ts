import {ValidationError} from 'apollo-server-express';
import {GraphQLScalarType} from 'graphql';
import {passwordValidator} from 'src/util/validations';

const passwordScalar = new GraphQLScalarType({
  name: 'Password',
  description: 'Password scalar custom type',
  // serialize(value) {
  //   return value.getTime(); // Convert outgoing Date to integer for JSON
  // },

  // Convert incoming integer to Date
  parseValue(value) {
    const passwordResult = passwordValidator.validate(value);
    if (passwordResult.error)
      throw new ValidationError(passwordResult.error.message);
    return passwordResult.value;
  },
  // parseLiteral(ast) {
  //   if (ast.kind === Kind.INT) {
  //     return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
  //   }
  //   return null; // Invalid hard-coded value (not an integer)
  // },
});

export default passwordScalar;
