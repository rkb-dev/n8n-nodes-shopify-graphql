# Changelog

All notable changes to the Shopify GraphQL n8n node will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation of Shopify GraphQL node
- Customer operations: get, getAll, search
- Order operations: get, getAll
- Product operations: get, getAll
- Smart batching with cost-aware pagination
- Rate limiting with exponential backoff
- Comprehensive error handling
- Shopify GraphQL API credentials
- Complete documentation suite

### Technical Details
- TypeScript implementation with full type safety
- n8n workflow integration
- Cursor-based pagination for large datasets
- Configurable batch sizes (1-250 items)
- Support for Shopify API versions 2024-07 and later
- Built-in credential testing
- Continue-on-fail error handling

## [0.1.0] - 2025-07-18

### Added
- Initial project structure
- Core node implementation
- Helper functions for GraphQL requests
- Basic documentation
- Build system with TypeScript and Gulp
- ESLint and Prettier configuration

### Development Notes
- Project created and structured according to n8n community node standards
- All core operations implemented and tested
- Clean, production-ready codebase
- Comprehensive testing and validation guides created
- Ready for integration testing and community submission

---

## Version History Notes

### Versioning Strategy
- **0.x.x**: Development and pre-release versions
- **1.0.0**: First stable release for community use
- **1.x.x**: Feature additions and improvements
- **2.x.x**: Major API changes or breaking changes

### Release Process
1. Update version in package.json
2. Update this CHANGELOG.md
3. Run full test suite
4. Build and verify: `npm run build`
5. Publish to NPM: `npm publish`
6. Tag release in git
7. Update documentation if needed

### Breaking Changes Policy
- Breaking changes will increment major version
- Deprecation warnings will be provided one version before removal
- Migration guides will be provided for breaking changes
- Backward compatibility maintained within major versions
