# Shopify GraphQL Node - Deployment & Publishing Guide

This guide covers how to deploy and publish the Shopify GraphQL node for n8n.

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Build process completes successfully (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] No temporary or test files in repository
- [ ] All critical files documented in plan.md

### Testing
- [ ] Node structure validation completed
- [ ] Helper functions tested
- [ ] GraphQL queries validated
- [ ] Integration testing with real Shopify store (if possible)
- [ ] Error handling tested
- [ ] Rate limiting behavior verified

### Documentation
- [ ] README.md is comprehensive and up-to-date
- [ ] USAGE_EXAMPLES.md provides clear examples
- [ ] TESTING_GUIDE.md is complete for maintainers
- [ ] plan.md reflects current project state

## Local Development Installation

### For n8n Development
1. **Clone and build the node**:
   ```bash
   git clone <repository-url>
   cd n8n-nodes-shopify-graphql
   npm install
   npm run build
   ```

2. **Link to local n8n installation**:
   ```bash
   # In the node directory
   npm link
   
   # In your n8n installation directory
   npm link n8n-nodes-shopify-graphql
   ```

3. **Restart n8n** to load the new node

### For n8n Cloud/Self-hosted
1. **Build the package**:
   ```bash
   npm run build
   npm pack
   ```

2. **Install in n8n**:
   ```bash
   npm install n8n-nodes-shopify-graphql-0.1.0.tgz
   ```

## NPM Publishing

### Prerequisites
- NPM account with publishing permissions
- Package name available on NPM registry
- Proper version numbering (semantic versioning)

### Publishing Steps

1. **Update package.json**:
   ```json
   {
     "name": "n8n-nodes-shopify-graphql",
     "version": "1.0.0",
     "author": {
       "name": "Your Name",
       "email": "your.email@example.com"
     },
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/n8n-nodes-shopify-graphql.git"
     }
   }
   ```

2. **Prepare for publishing**:
   ```bash
   # Clean build
   rm -rf dist node_modules
   npm install
   npm run build
   
   # Run pre-publish checks
   npm run prepublishOnly
   ```

3. **Publish to NPM**:
   ```bash
   # Login to NPM (if not already logged in)
   npm login
   
   # Publish the package
   npm publish
   ```

4. **Verify publication**:
   - Check package on npmjs.com
   - Test installation: `npm install n8n-nodes-shopify-graphql`

## n8n Community Submission

### Prerequisites
- Package published on NPM
- Comprehensive documentation
- Working examples
- Proper testing

### Submission Process

1. **Create community submission**:
   - Go to n8n community hub
   - Submit node for review
   - Provide package name and description

2. **Required information**:
   - NPM package name: `n8n-nodes-shopify-graphql`
   - Description: "n8n community node for Shopify GraphQL API with smart batching and rate limiting"
   - Keywords: shopify, graphql, ecommerce, api
   - Documentation links

3. **Review process**:
   - n8n team reviews functionality
   - Code quality assessment
   - Documentation review
   - Community feedback period

## Version Management

### Semantic Versioning
- **Major (1.0.0)**: Breaking changes
- **Minor (1.1.0)**: New features, backward compatible
- **Patch (1.1.1)**: Bug fixes, backward compatible

### Release Process
1. **Update version in package.json**
2. **Update CHANGELOG.md** with changes
3. **Run full test suite**
4. **Build and publish**:
   ```bash
   npm version patch  # or minor/major
   npm run build
   npm publish
   ```

## Deployment Environments

### Development
- Local n8n instance
- Development Shopify store
- Test credentials and data

### Staging
- Staging n8n environment
- Production-like Shopify store
- Real data testing (limited scope)

### Production
- Production n8n instance
- Live Shopify stores
- Full monitoring and error tracking

## Monitoring and Maintenance

### Key Metrics
- Installation count (NPM downloads)
- Error rates in production
- Performance metrics
- User feedback and issues

### Maintenance Tasks
- Regular dependency updates
- Shopify API version updates
- Bug fixes and improvements
- Documentation updates

### Support Channels
- GitHub issues for bug reports
- n8n community forums for usage questions
- NPM package page for general information

## Troubleshooting Deployment

### Common Issues

1. **Build Failures**:
   - Check TypeScript compilation
   - Verify all dependencies installed
   - Review build logs for specific errors

2. **NPM Publishing Issues**:
   - Verify package name availability
   - Check NPM authentication
   - Review package.json configuration

3. **n8n Integration Issues**:
   - Verify n8n API version compatibility
   - Check node registration in package.json
   - Review credential configuration

### Recovery Procedures

1. **Rollback Version**:
   ```bash
   npm unpublish n8n-nodes-shopify-graphql@1.0.1
   npm publish  # Previous version
   ```

2. **Emergency Fixes**:
   - Create hotfix branch
   - Apply minimal fix
   - Test thoroughly
   - Publish patch version

## Security Considerations

### Code Security
- No hardcoded credentials
- Secure credential handling
- Input validation and sanitization
- Error message sanitization

### API Security
- Proper authentication handling
- Rate limiting compliance
- Secure token storage
- HTTPS-only communication

### Publishing Security
- Use NPM 2FA
- Verify package integrity
- Monitor for unauthorized changes
- Regular security audits

## Post-Deployment

### Success Metrics
- Successful installations
- Positive user feedback
- Stable operation in production
- Growing adoption

### Continuous Improvement
- Monitor user feedback
- Track common issues
- Plan feature enhancements
- Maintain documentation

### Community Engagement
- Respond to issues and questions
- Participate in n8n community
- Share usage examples
- Collaborate on improvements
