#!/bin/bash
PREFIX=~/"Library/Application Scripts/com.coteditor.CotEditor/Emmet"
mkdir -p "$PREFIX"
osacompile -l JavaScript -o "$PREFIX/Expand Abbreviation.^e.scptd" dist/Emmet.js

links=(
'Balance (outward).^d'
#'Balance (inward).^D'
'HTML Go To Matching Tag Pair.^~j'
'Wrap With Abbreviation.^w'
'Next Edit Point.@$→'
'Previous Edit Point.@$←'
'Select Next Item.^$→'
'Select Previous Item.^$←'
'Toggle Comment.^$_'
'HTML Split Join Tag Declaration.@J'
'HTML Remove Tag.@7'
'Merge Lines.$^m'
#'Update Image Size.^i'
'Numbers Evaluate Math Expression.^Y'
'Numbers Increment number by 01.^~↑'
'Numbers Decrement number by 01.^~↓'
'Numbers Increment number by 1.^~@↑'
'Numbers Decrement number by 1.^~@↓'
'Numbers Increment number by 10.^~@$↑'
'Numbers Decrement number by 10.^~@$↓'
'CSS Reflect Value.^@'
#'Encode Decode data URL image.^I'
)
for name in "${links[@]}"; do
    ln -fs "Expand Abbreviation.^e.scptd" "$PREFIX/$name.scptd"
done
