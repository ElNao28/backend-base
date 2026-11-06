import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { DefaultResponseDto } from '../../common/dto/default-response.dto.js';
import { PaginationDataDto } from '../../common/dto/pagination-data.dto.js';

interface ResponseApiOptions {
  isArray?: boolean;
  status?: HttpStatus;
  isPagination?: boolean;
}

export const ResponseDataApi = <TModel extends Type<any>>(
  model: TModel,
  options: ResponseApiOptions = {},
) => {
  const {
    isArray = false,
    isPagination = false,
    status = HttpStatus.OK,
  } = options;

  return applyDecorators(
    ApiExtraModels(DefaultResponseDto, model, PaginationDataDto),
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(DefaultResponseDto) },
          {
            properties: {
              ...(isArray
                ? {
                    data: {
                      type: 'array',
                      items: {
                        $ref: getSchemaPath(model),
                      },
                    },
                  }
                : {
                    data: {
                      $ref: getSchemaPath(model),
                    },
                  }),
            },
          },
          ...(isPagination
            ? [
                {
                  properties: {
                    pagination: {
                      $ref: getSchemaPath(PaginationDataDto),
                    },
                  },
                },
              ]
            : []),
        ],
      },
    }),
    HttpCode(status),
  );
};
