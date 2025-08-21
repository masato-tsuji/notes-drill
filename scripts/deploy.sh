#!/bin/bash
# gh-pagesブランチでpushするこどでgithub側のactionにより
# webページをデプロイする

# mainブランチに切り替え
git checkout main

# mainブランチの最新の変更をプッシュ
git add .
git commit -m "Update main branch with latest changes"
git push origin main

# gh-pagesブランチに切り替え
git checkout gh-pages

# mainブランチの変更をマージ
git merge main

# gh-pagesブランチの変更をプッシュ
git push --force origin gh-pages

# mainブランチに戻る
git checkout main

