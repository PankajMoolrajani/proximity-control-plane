# Proximity Control Plane Web App

This is a web application that enables users to configure API security policies related to:
- **Authentication (authn)**
- **Authorization (OPA-based, authz)**
- **Filtering (ModSecurity-based)**

## Overview

1. **Policy Definition**:  
   - Start by creating a "Virtual Service".
   - Define and configure various API security policies (authn, authz, filtering) for that virtual service.
   - Test the impact of these policies directly from the control plane web interface.

2. **Policy Enforcement**:  
   - Any policy defined here is automatically shipped to a data plane component built in another repository.
   - The data plane is implemented using Envoy Proxy, running either as a sidecar or gateway alongside application services.
   - It enforces authentication, authorization, and filtering based on the configuration from this control plane.

## Features

- Friendly UI to write and manage complex security policies.
- Integrates with OPA (Open Policy Agent) for fine-grained authorization.
- Supports ModSecurity for powerful request filtering.
- Allows pre-deployment policy impact testing to validate security decisions.

## Typical Workflow

1. Log into the web app.
2. Create a new Virtual Service to represent your API/application.
3. Configure required authentication, authorization, and filtering policies for it.
4. Test the configuration and observe the expected enforcement behavior.
5. Upon finalization, policies are automatically pushed to the data plane proxy (Envoy) for enforcement.

## Note

- The data plane, which enforces these policies, is maintained in a separate repository and uses Envoy Proxy as its foundation.

---

**For questions or issues, please contact [PankajMoolrajani](https://github.com/PankajMoolrajani) or open an issue in this repository.**
