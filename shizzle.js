(function(){
    //fucking ie8
    if( typeof document.getElementsByClassName !== "function"){
        document.getElementsByClassName= function( className, nodeName ){
        var a = [];
        var re = new RegExp('(^| )'+className+'( |$)');
        var els = nodeName.getElementsByTagName("*");
        for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
            return a;
        };
    }
    window.$ = window.Shizzle = Shizzle;

    function Shizzle(selector){
        if(typeof selector != 'string') return new Error("Selctor must be a string!");
        var charArray = selector.trim().split('')
        ,   tokens = tokenize(charArray)
        return execute(tokens);
    }

    var fns = {
        'element' : {
            check : function(el, value){
                return el.tagName === value.toUpperCase()
            },
            get : function(value){
                return Array.prototype.slice.call(document.getElementsByTagName(value))
            }
        },
        'class' : {
            check : function(el, value){
                return el.className.indexOf(value) >= 0;
            },
            get : function(value){
                return Array.prototype.slice.call(document.getElementsByClassName(value))
            }
        }
    }

    function tokenize(charArray){
        var currentChar = charArray[0]
        ,   currentSet
        ,   pos = 0
        ,   currentToken
        ,   next
        ,   tokens = [];

        while(currentChar){
            if(currentChar === "#"){
                currentToken = token("id");
                tokens.unshift(currentToken); // The right most id gets pushed to the front as ids are unique
            }else if(currentChar === '.'){
                currentToken = token("class");
                tokens.push(currentToken);
            }else if(currentChar !== ' '){
                currentToken = token("element", currentChar);
                tokens.push(currentToken);
            }
            next = charArray[++pos];
            while(next){
                if(next.match(/^[a-z_-]+$/)){
                    currentToken.value += next;
                    next = charArray[++pos];
                }else{
                    break;
                }
            }
            currentChar = charArray[pos];
        }
        return tokens;
    }

    function execute(tokens){
        var usedId = false
        ,   skip = false
        ,   token
        ,   j
        ,   currentEls
        ,   returnSet = [];
        for(var i = 0, l = tokens.length; i < l; i++){
            token = tokens[i];
            if( token.type === "id" && usedId) skip = true;
            if(!skip){
                if(token.type === "id"){
                    // No need to do any checks as ids are always pushed to the front and executed first
                    currentEls = document.getElementById(token.value);
                    if(!currentEls) return [];
                    returnSet.push(currentEls);
                }else{
                    if(usedId){
                        if(fns[token.type].check(currentEls, token.value)) return [];
                    }else{
                        if(returnSet.length > 0){
                            currentEls = returnSet;
                            returnSet = [];
                            for(j = 0; j < currentEls.length; j++){
                                if(fns[token.type].check(currentEls[j], token.value)) returnSet.push(currentEls[j])
                            }
                        }else{
                            returnSet.push.apply(returnSet, fns[token.type].get(token.value));
                        }
                    }
                }
            }
        }
        return returnSet;
    }

    function token(type, value){
        return {
            type : type,
            value : value || ''
        }
    }
}())