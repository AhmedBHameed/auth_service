import {ValidationError} from 'apollo-server-express';
import {GraphQLScalarType} from 'graphql';
import {requiredStringValidator} from 'src/util/validations';

const requiredStringScalar = new GraphQLScalarType({
  name: 'RequiredString',
  description: 'Required string scalar custom type',
  // serialize(value) {
  //   return value.getTime(); // Convert outgoing Date to integer for JSON
  // },

  // Convert incoming integer to Date
  parseValue(value) {
    const stringResult = requiredStringValidator.validate(value);
    if (stringResult.error)
      throw new ValidationError(stringResult.error.message);
    return stringResult.value;
  },
  // parseLiteral(ast) {
  //   if (ast.kind === Kind.INT) {
  //     return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
  //   }
  //   return null; // Invalid hard-coded value (not an integer)
  // },
});

export default requiredStringScalar;
