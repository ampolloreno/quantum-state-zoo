# GitHub Pages setup

Repository: https://github.com/ampolloreno/quantum-state-zoo
Intended website: https://quantumstatezoo.org/

This is a project Pages site. The account's personal-site repository is separate.

## Release an accepted change

After reviewing and merging the source, publish explicitly:

```sh
gh workflow run deploy-pages.yml --repo ampolloreno/quantum-state-zoo --ref main
```

The publication workflow runs only on manual dispatch from main. The checks workflow runs on pushes and pull requests. CODEOWNERS requests your review; configure required reviews in GitHub settings if desired. No branch protection is claimed by these files.

## DNS and HTTPS

DNS for quantumstatezoo.org:
Type    Host    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     ampolloreno.github.io

The www target has no repository path. Keep unrelated email and verification records.

Use the domain's authoritative DNS provider. In Namecheap, this is usually Domain List → Manage → Advanced DNS when using Namecheap DNS. Remove only conflicting web records for @ or www on this domain. Preserve unrelated records.

Wait for DNS and GitHub's certificate, then enable Enforce HTTPS in:
https://github.com/ampolloreno/quantum-state-zoo/settings/pages

GitHub recommends first verifying the domain in your account's Pages settings. The TXT challenge is supplied by GitHub and is specific to your account.

Documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
