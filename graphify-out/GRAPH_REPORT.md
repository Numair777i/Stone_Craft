# Graph Report - Buy-Product  (2026-09-13)

## Corpus Check
- Large corpus: 52 files · ~8,622,909 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 176 nodes · 269 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Server Core & Auth
- Payments & Orders
- Frontend Tooling
- Server Dependencies
- Frontend Components
- Context & State
- Data Models
- Product Data
- Routes & Handlers
- Frontend Config
- UI Components
- Services
- Integration APIs

## God Nodes (most connected - your core abstractions)
1. `react` - 18 edges
2. `react-router-dom` - 10 edges
3. `AuthContext` - 7 edges
4. `CartContext` - 6 edges
5. `scripts` - 5 edges
6. `mongoose` - 5 edges
7. `scripts` - 4 edges
8. `sendOrderConfirmation()` - 3 edges
9. `products` - 3 edges
10. `WishlistContext` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "Server Core & Auth"
Cohesion: 0.08
Nodes (23): bcryptjs, cors, express, jsonwebtoken, mongoose, app, authRoutes, cors (+15 more)

### Community 1 - "Payments & Orders"
Cohesion: 0.10
Nodes (21): nodemailer, mongoose, orderSchema, Order, router, { sendOrderConfirmation }, User, {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripePaymentIntent,
  verifyStripeSignature,
} (+13 more)

### Community 2 - "Frontend Tooling"
Cohesion: 0.10
Nodes (22): dependencies, react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite, name, private (+14 more)

### Community 3 - "Server Dependencies"
Cohesion: 0.11
Nodes (18): dotenv, nodemon, razorpay, stripe, author, description, devDependencies, nodemon (+10 more)

### Community 4 - "Frontend Components"
Cohesion: 0.19
Nodes (9): react-router-dom, App(), CartDrawer(), CheckoutModal(), Contact(), Footer(), KitHighlights(), ScrollToTop() (+1 more)

### Community 5 - "Context & State"
Cohesion: 0.29
Nodes (5): AccountPage(), AdminPanel(), OrderTracking(), AuthContext, AuthProvider()

### Community 6 - "Data Models"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

### Community 7 - "Product Data"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, mongoose, nodemailer (+2 more)

### Community 8 - "Routes & Handlers"
Cohesion: 0.36
Nodes (4): products, ProductCard(), ProductPage(), Shop()

### Community 10 - "UI Components"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 11 - "Services"
Cohesion: 0.40
Nodes (4): extended, Hero(), products, NavBar()

## Knowledge Gaps
- **84 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 89 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Frontend Config` to `Frontend Tooling`, `Frontend Components`, `Context & State`, `Routes & Handlers`, `Services`, `Integration APIs`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `Frontend Components` to `Routes & Handlers`, `Frontend Config`, `Frontend Tooling`, `Context & State`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Data Models` to `Frontend Tooling`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Server Core & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.07671957671957672 - nodes in this community are weakly interconnected._
- **Should `Payments & Orders` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Frontend Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.09666666666666666 - nodes in this community are weakly interconnected._